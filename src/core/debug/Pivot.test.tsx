import { GameObject, Vec2 } from "sparkengineweb";
import Pivot from "./Pivot";

describe('core/debug/Pivot', () => {
    describe('.match()', () => {
        it('Should match the pivot position to the one of the target', () => {
            const target = new GameObject({
                transform: {
                    position: new Vec2(15, 25),
                    size: { width: 10, height: 30 }
                }
            });

            const pivot = new Pivot();
            pivot.match(target);

            expect(pivot.transform.position).toEqual(target.transform.position);
        });
    })
});