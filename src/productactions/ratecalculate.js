const ratecalculator = (sum = 0, num = 0) => {
    sum = parseFloat(sum);
    num = parseFloat(num);
    if (isNaN(sum) || isNaN(num) || sum <= 0 || num <= 0) {
        return 0;
    } else {
        const rate = (sum / num).toFixed(1);

        switch (isFinite(rate)) {
            case true:
                return rate;

            case false:
                return 0;

            default:
                break;
        }
    }
}

export default ratecalculator;