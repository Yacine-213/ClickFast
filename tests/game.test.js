function registerClick(game) {
    if (!game.playing) return;
    game.score++;
}

describe("ClickFast - compteur de clics", () => {
    test("le score augmente de 1 pendant la partie", () => {
        const game = { score: 0, playing: true };

        registerClick(game);

        expect(game.score).toBe(1);
    });

    test("le score ne change pas si la partie est terminée", () => {
        const game = { score: 0, playing: false };

        registerClick(game);

        expect(game.score).toBe(0);
    });
});
