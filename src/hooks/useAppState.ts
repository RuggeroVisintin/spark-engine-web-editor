import { useEffect, useState } from "react";
import { ReactStateRepository } from "../core/editor";

export const useAppState = <T>(repository: ReactStateRepository<T>): [T] => {
    const [state, setState] = useState({} as T);

    useEffect(() => {
        return repository.subscribe((state) => {
            setState(state)
        });
    }, [repository]);

    return [state];
};