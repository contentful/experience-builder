export default class DragState {
  private isDraggingItem;
  private isDragStartedOnParent;

  constructor() {
    this.isDragStartedOnParent = false;
    this.isDraggingItem = false;
  }

  get isDragging() {
    return this.isDraggingItem;
  }

  get isDraggingOnParent() {
    return this.isDragStartedOnParent;
  }

  public updateIsDragging(isDraggingItem: boolean) {
    this.isDraggingItem = isDraggingItem;
  }
  public updateIsDragStartedOnParent(isDragStartedOnParent: boolean) {
    this.isDragStartedOnParent = isDragStartedOnParent;
  }

  public resetState() {
    this.isDraggingItem = false;
    this.isDragStartedOnParent = false;
  }
}
