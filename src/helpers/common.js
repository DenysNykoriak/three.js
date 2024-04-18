export const randNum = (min, max, withNegative) => {
	const randNumber = Math.random() * (max - min) + min;

	if (withNegative) {
		return Math.random() > 0.5 ? randNumber : -randNumber;
	}

	return randNumber;
};
