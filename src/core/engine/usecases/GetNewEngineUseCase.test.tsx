import { GetNewEngineUseCase } from './GetNewEngineUseCase';

describe('core/engine/usecases/GetNewEngineUseCase', () => {

    it('Should return a new instance of GameEngine with the given options', async () => {
        const command = {
            width: 800,
            height: 600,
            context: {} as CanvasRenderingContext2D
        };

        const useCase = new GetNewEngineUseCase();
        const engine = await useCase.execute(command);
    })
})