class DragState {
  private isDraggingItem;
  private isDragStartedOnParent;

  constructor() {
    this.isDragStartedOnParent = false;
    this.isDraggingItem = false;
  }

  get isDragging() {
    return this.isDraggingItem;
  }

  get isDragStart() {
    return this.isDragStartedOnParent;
  }

  public updateIsDragging(isDraggingItem: boolean) {
    this.isDraggingItem = isDraggingItem;
  }
  public updateIsDragStartedOnParent(isDragStartedOnParent: boolean) {
    this.isDragStartedOnParent = isDragStartedOnParent;
  }

  public reset() {
    this.isDraggingItem = false;
    this.isDragStartedOnParent = false;
  }
}

export default new DragState();
