import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const createFighterInfoLine = text => {
            const textLine = createElement({
                tagName: 'p',
                className: 'fighter-preview___p'
            });
            const textNode = document.createTextNode(text);
            textLine.append(textNode);
            return textLine;
        };
        const textInfo = createElement({
            tagName: 'div',
            className: 'fighter-preview___text-info'
        });
        // eslint-disable-next-line no-use-before-define
        const imagePreview = createFighterImage(fighter);
        const namePreview = createFighterInfoLine(fighter.name);
        const healthPreview = createFighterInfoLine(`Health - ${fighter.health}`);
        const attackPreview = createFighterInfoLine(`Attack - ${fighter.attack}`);
        const defensePreview = createFighterInfoLine(`Defense - ${fighter.defense}`);
        textInfo.append(namePreview, healthPreview, attackPreview, defensePreview);
        fighterElement.append(imagePreview, textInfo);
    }
    return fighterElement;
}
