export const ToCaseCount = (count, string) => {
    // string = ["товар", "товара", "товаров"]
	if ((count === 1) || (count > 20 && count % 10 === 1)) return string[0];
    else if ((count >= 2 && count <= 4) || (count > 20 && count % 10 >= 2 && count % 10 <= 4)) return string[1];
    else return string[2];
}