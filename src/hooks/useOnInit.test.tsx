import { render } from "@testing-library/react";
import { useOnInit } from "./useOnInit";
import React from "react";
import { withStrictMode } from "./withStrictMode";

const Util = ({ cb, number }: { cb: Function, number: number }) => {
    useOnInit(() => { cb() });
    return <></>;
}

describe('hooks/useOnInit', () => {
    it('Should execute the given callback only once', () => {
        const callback = jest.fn();

        render(withStrictMode(<Util cb={callback} number={1} />));

        expect(callback).toHaveBeenCalledTimes(1);
    });
});