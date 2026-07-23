import {
  Color,
  Graphics,
  Label,
  Node,
  UITransform,
  Vec2,
} from 'cc';
import { StoryObjective } from './StoryTypes';

export class QuestGuide {
  private readonly marker: Node;
  private readonly markerGraphics: Graphics;
  private readonly hudRoot: Node;
  private readonly arrowGraphics: Graphics;
  private readonly objectiveLabel: Label;
  private objective: StoryObjective | null = null;
  private elapsed = 0;

  constructor(world: Node, hudParent: Node) {
    this.marker = new Node('StoryQuestMarker');
    this.marker.parent = world;
    this.marker.addComponent(UITransform).setContentSize(120, 120);
    this.markerGraphics = this.marker.addComponent(Graphics);
    this.marker.active = false;

    this.hudRoot = new Node('StoryQuestGuideHud');
    this.hudRoot.parent = hudParent;
    this.hudRoot.setPosition(0, 0, 250);
    this.hudRoot.addComponent(UITransform).setContentSize(1280, 720);
    this.arrowGraphics = this.hudRoot.addComponent(Graphics);
    const labelNode = new Node('StoryQuestObjectiveLabel');
    labelNode.parent = this.hudRoot;
    labelNode.setPosition(0, 306, 1);
    labelNode.addComponent(UITransform).setContentSize(680, 42);
    this.objectiveLabel = labelNode.addComponent(Label);
    this.objectiveLabel.fontSize = 18;
    this.objectiveLabel.lineHeight = 24;
    this.objectiveLabel.color = new Color(255, 239, 197);
    this.objectiveLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
    this.objectiveLabel.verticalAlign = Label.VerticalAlign.CENTER;
    this.objectiveLabel.overflow = Label.Overflow.SHRINK;
    this.hudRoot.active = false;
  }

  setObjective(objective: StoryObjective | null) {
    this.objective = objective;
    this.elapsed = 0;
    if (!objective || objective.targetX === undefined || objective.targetY === undefined) {
      this.marker.active = false;
      this.hudRoot.active = Boolean(objective);
      this.objectiveLabel.string = objective?.detail ? `${objective.title} · ${objective.detail}` : objective?.title ?? '';
      this.arrowGraphics.clear();
      return;
    }
    this.marker.setPosition(objective.targetX, objective.targetY, 120);
    this.marker.active = true;
    this.hudRoot.active = true;
    this.objectiveLabel.string = objective.detail ? `${objective.title} · ${objective.detail}` : objective.title;
    this.redrawMarker(0);
  }

  update(dt: number, playerPosition: Vec2, viewportWidth = 1280, viewportHeight = 720) {
    if (!this.objective || this.objective.targetX === undefined || this.objective.targetY === undefined) return;
    this.elapsed += dt;
    this.redrawMarker(this.elapsed);
    this.drawOffscreenArrow(playerPosition, viewportWidth, viewportHeight);
  }

  destroy() {
    this.marker.destroy();
    this.hudRoot.destroy();
  }

  private redrawMarker(time: number) {
    const pulse = 1 + Math.sin(time * 3.4) * 0.08;
    const radius = 35 * pulse;
    this.markerGraphics.clear();
    this.markerGraphics.fillColor = new Color(242, 190, 77, 42);
    this.markerGraphics.circle(0, 0, radius);
    this.markerGraphics.fill();
    this.markerGraphics.strokeColor = new Color(255, 224, 126, 230);
    this.markerGraphics.lineWidth = 4;
    this.markerGraphics.circle(0, 0, radius);
    this.markerGraphics.stroke();
  }

  private drawOffscreenArrow(playerPosition: Vec2, viewportWidth: number, viewportHeight: number) {
    const dx = (this.objective?.targetX ?? playerPosition.x) - playerPosition.x;
    const dy = (this.objective?.targetY ?? playerPosition.y) - playerPosition.y;
    const margin = 72;
    const halfWidth = viewportWidth / 2 - margin;
    const halfHeight = viewportHeight / 2 - margin;
    this.arrowGraphics.clear();
    if (Math.abs(dx) <= halfWidth && Math.abs(dy) <= halfHeight) return;

    const scale = Math.min(halfWidth / Math.max(1, Math.abs(dx)), halfHeight / Math.max(1, Math.abs(dy)));
    const x = dx * scale;
    const y = dy * scale;
    const angle = Math.atan2(dy, dx);
    const size = 22;
    const left = angle + Math.PI * 0.78;
    const right = angle - Math.PI * 0.78;
    this.arrowGraphics.fillColor = new Color(250, 205, 91, 245);
    this.arrowGraphics.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    this.arrowGraphics.lineTo(x + Math.cos(left) * size, y + Math.sin(left) * size);
    this.arrowGraphics.lineTo(x + Math.cos(right) * size, y + Math.sin(right) * size);
    this.arrowGraphics.close();
    this.arrowGraphics.fill();
  }
}

