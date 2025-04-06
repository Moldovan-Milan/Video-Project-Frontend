export default function isColorDark(hexColor) {
    console.log(hexColor)
    hexColor = hexColor.replace('#', '');

    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

    if(luminance < 0.5)
    {
        return true;
    }
    return false;
}
