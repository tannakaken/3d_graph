import { resolveColor } from './color.helper';

describe('resolveColor', () => {
    it('should return a valid HSL color for the first index', () => {
        const color = resolveColor(0, 10);
        expect(color).toBe('hsl(0, 100%, 50%)');
    });

    it('should return a valid HSL color for the last index', () => {
        const color = resolveColor(9, 10);
        expect(color).toBe('hsl(324, 100%, 50%)');
    });

    it('should return a valid HSL color for a middle index', () => {
        const color = resolveColor(5, 10);
        expect(color).toBe('hsl(180, 100%, 50%)');
    });

    it('should handle a single-length array', () => {
        const color = resolveColor(0, 1);
        expect(color).toBe('hsl(0, 100%, 50%)');
    });

    it('should handle a large index and length', () => {
        const color = resolveColor(500, 1000);
        expect(color).toBe('hsl(180, 100%, 50%)');
    });

    it('should handle index 0 with large length', () => {
        const color = resolveColor(0, 1000);
        expect(color).toBe('hsl(0, 100%, 50%)');
    });

    it('should handle index equal to length - 1', () => {
        const color = resolveColor(999, 1000);
        expect(color).toBe('hsl(359.64, 100%, 50%)');
    });
});
