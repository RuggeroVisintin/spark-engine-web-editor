
export interface MouseClickEvent {
    targetX: number;
    targetY: number;
    button: number;
}

export interface MouseDragEvent extends MouseClickEvent {
    deltaX: number;
    deltaY: number;
    modifiers: Record<string, true>;

    // TODO: add modifier button support
}
