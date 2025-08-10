
export interface MouseClickEvent {
    targetX: number;
    targetY: number;
    button: number;
    modifiers: Record<string, true>;
}

export interface MouseDragEvent extends MouseClickEvent {
    deltaX: number;
    deltaY: number;
}
