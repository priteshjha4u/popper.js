import getPopperClientRect from '../utils/getPopperClientRect';
import getOppositePlacement from '../utils/getOppositePlacement';

/**
 * Modifier used to make sure the popper does not overflows from it's boundaries
 * @method
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
export default function preventOverflow(data, options) {
    function shouldMoveWithTarget(direction) {
        if (!options.moveWithTarget) {
            return false;
        }
        let placement = data.originalPlacement.split('-')[0];

        if (data.flipped && placement === direction || placement === getOppositePlacement(direction)) {
            return true;
        }
        if (placement !== direction && placement !== getOppositePlacement(direction)) {
            return true;
        }

        return false;
    }
    const order = options.priority;
    const popper = getPopperClientRect(data.offsets.popper);

    const check = {
        left() {
            let left = popper.left;
            if (popper.left < data.boundaries.left && !shouldMoveWithTarget('left')) {
                left = Math.max(popper.left, data.boundaries.left);
            }
            return { left: left };
        },
        right() {
            let left = popper.left;
            if (popper.right > data.boundaries.right && !shouldMoveWithTarget('right')) {
                left = Math.min(popper.left, data.boundaries.right - popper.width);
            }
            return { left: left };
        },
        top() {
            let top = popper.top;
            if (popper.top < data.boundaries.top && !shouldMoveWithTarget('top')) {
                top = Math.max(popper.top, data.boundaries.top);
            }
            return { top: top };
        },
        bottom() {
            let top = popper.top;
            if (popper.bottom > data.boundaries.bottom && !shouldMoveWithTarget('bottom')) {
                top = Math.min(popper.top, data.boundaries.bottom - popper.height);
            }
            return { top: top };
        }
    };

    order.forEach((direction) => {
        data.offsets.popper = Object.assign(popper, check[direction]());
    });

    return data;
}