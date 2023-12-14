import createElement from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const modalBodyElement = createElement({
        tagName: 'div',
        className: 'modal-body'
    });

    const winnerImage = createFighterImage(fighter);

    const winnerText = createElement({
        tagName: 'p',
        className: 'modal-text'
    });

    winnerText.innerText = `Winner - ${fighter.name}`;
    modalBodyElement.append(winnerImage, winnerText);

    showModal({ title: `Fatality!`, bodyElement: modalBodyElement });
}
