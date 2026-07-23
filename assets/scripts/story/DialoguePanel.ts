import {
  BlockInputEvents,
  Color,
  Graphics,
  Label,
  Node,
  UITransform,
} from 'cc';
import { DialogueLine } from './StoryTypes';

export class DialoguePanel {
  private readonly root: Node;
  private readonly speakerLabel: Label;
  private readonly bodyLabel: Label;
  private readonly hintLabel: Label;
  private lines: DialogueLine[] = [];
  private index = 0;
  private completed: (() => void) | null = null;

  constructor(parent: Node) {
    this.root = new Node('StoryDialoguePanel');
    this.root.parent = parent;
    this.root.setPosition(0, -245, 300);
    this.root.addComponent(UITransform).setContentSize(1120, 210);
    this.root.addComponent(BlockInputEvents);

    const background = this.root.addComponent(Graphics);
    background.fillColor = new Color(42, 29, 22, 242);
    background.roundRect(-560, -105, 1120, 210, 18);
    background.fill();
    background.strokeColor = new Color(210, 164, 91, 255);
    background.lineWidth = 4;
    background.roundRect(-558, -103, 1116, 206, 16);
    background.stroke();

    this.speakerLabel = this.createLabel('StorySpeaker', -460, 66, 210, 42, 23, new Color(245, 203, 121));
    this.bodyLabel = this.createLabel('StoryBody', 45, 5, 900, 118, 22, new Color(255, 244, 218));
    this.bodyLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
    this.bodyLabel.verticalAlign = Label.VerticalAlign.TOP;
    this.bodyLabel.enableWrapText = true;
    this.hintLabel = this.createLabel('StoryAdvanceHint', 445, -77, 190, 28, 14, new Color(205, 183, 148));
    this.hintLabel.string = '点击继续';
    this.root.on(Node.EventType.TOUCH_END, this.advance, this);
    this.root.active = false;
  }

  get isOpen() {
    return this.root.active;
  }

  open(lines: DialogueLine[], completed?: () => void) {
    this.lines = [...lines];
    this.index = 0;
    this.completed = completed ?? null;
    this.root.active = this.lines.length > 0;
    if (this.root.active) this.renderCurrent();
    else this.finish();
  }

  advance() {
    if (!this.root.active) return;
    this.index++;
    if (this.index >= this.lines.length) {
      this.finish();
      return;
    }
    this.renderCurrent();
  }

  close() {
    this.lines = [];
    this.index = 0;
    this.completed = null;
    this.root.active = false;
  }

  destroy() {
    this.root.off(Node.EventType.TOUCH_END, this.advance, this);
    this.root.destroy();
  }

  private finish() {
    const completed = this.completed;
    this.close();
    completed?.();
  }

  private renderCurrent() {
    const line = this.lines[this.index];
    const narration = line.kind === 'narration';
    const system = line.kind === 'system';
    this.speakerLabel.string = narration ? '旁白' : system ? '提示' : line.speaker;
    this.bodyLabel.string = line.text;
    this.hintLabel.string = `${this.index + 1}/${this.lines.length}  点击继续`;
  }

  private createLabel(name: string, x: number, y: number, width: number, height: number, fontSize: number, color: Color) {
    const node = new Node(name);
    node.parent = this.root;
    node.setPosition(x, y, 1);
    node.addComponent(UITransform).setContentSize(width, height);
    const label = node.addComponent(Label);
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.color = color;
    label.overflow = Label.Overflow.CLAMP;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }
}

