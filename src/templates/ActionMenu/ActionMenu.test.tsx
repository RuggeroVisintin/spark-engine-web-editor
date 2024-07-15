import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ActionMenu } from ".";

describe('ActionMenu', () => {
    describe('File>Open', () => {
        it('Should invoke .onFileOpen method with the given filehandle', (done) => {
            const onFileOpen = jest.fn();
            const onFileSave = jest.fn();

            const actionMenu = <ActionMenu onFileOpen={onFileOpen} onFileSave={onFileSave}></ActionMenu>;

            render(actionMenu);

            fireEvent.click(screen.getByTestId('action-menu.file.trigger'));
            fireEvent.click(screen.getAllByTestId('action-menu.file.item')[0]);

            setTimeout(() => {
                expect(onFileOpen).toHaveBeenCalledWith({ name: 'test', kind: 'file' });
                done();
            })
        });
        it.todo('Should invoke .onSceneSave method with the given filehandle');
    })
})