import { useRef, useEffect } from "react"
import { Function } from "../core/common";

export const useOnInit = (callback: Function) => {
    const isMount = useRef(false);

    useEffect(() => {
        if (isMount.current === true) return;
        isMount.current = true;
        callback();
    }, []);
}