export function buildSecondaryColor(hslColor) {
  const { h, s, l } = hslColor;

  if (l >= 50) {
    const newLightness = l - 40;
    return { h, s, l: newLightness > 100 ? 100 : newLightness };
  } else {
    const newLightness = l + 40;
    return { h, s, l: newLightness < 0 ? 0 : newLightness };
  }
}

export function replaceFillInSvg(svg, color) {
  const { h, s, l } = color;
  return svg.replace(
    /id="colorized"(.*?)( fill="#\w+"| )(.*?)/gm,
    `id="colorized"$1 fill="hsl(${h}, ${s}%, ${l}%)"$2`
  );
}
