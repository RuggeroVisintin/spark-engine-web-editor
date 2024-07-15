import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { PopupMenu } from ".";

describe('PopupMenu', () => {
    it('Should render the menu label based on the given config', () => {
        const popupMenu = <PopupMenu data-testid='test-popup-menu' label="File"></PopupMenu>;

        render(popupMenu);
        expect(screen.getByTestId(`test-popup-menu.trigger`)).toHaveTextContent('File');
    })
    
    it.todo('Should invoke the given callback when item is clicked if action is defined');
    
    it('Should open without any child menu at screen', () => {
        const popupMenu = <PopupMenu data-testid='test-popup-menu-file' label="File" items={[{
            label: 'Open'
        }, {
            label: 'Save'
        }]}></PopupMenu>;

        render(popupMenu);
        expect(screen.queryAllByTestId(`test-popup-menu-file.item`)).toEqual([]);
    });

    it('Should open the child submenu when children property is defined', () => {
        const popupMenu = <PopupMenu data-testid='test-popup-menu-file' label="File" items={[{
            label: 'Open'
        }, {
            label: 'Save'
        }]}></PopupMenu>;

        render(popupMenu);
        fireEvent.click(screen.getByTestId(`test-popup-menu-file.trigger`));

        const items = screen.queryAllByTestId(`test-popup-menu-file.item`);

        expect(items[0]).toHaveTextContent('Open');
        expect(items[1]).toHaveTextContent('Save');
    });

    it('Should close the menu if an action is clicked', () => {
        const popupMenu = <PopupMenu data-testid='test-popup-menu-file' label="File" items={[{
            label: 'Open'
        }, {
            label: 'Save'
        }]}></PopupMenu>;

        render(popupMenu);
        fireEvent.click(screen.getByTestId(`test-popup-menu-file.trigger`));

        const items = screen.queryAllByTestId(`test-popup-menu-file.item`);

        fireEvent.click(items[0])
        expect(screen.queryAllByTestId(`test-popup-menu-file.item`)).toEqual([]);
    });
})