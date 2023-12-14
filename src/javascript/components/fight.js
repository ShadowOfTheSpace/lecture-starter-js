import controls from '../../constants/controls';

/* eslint max-classes-per-file: ["error", 2] */

class FighterState {
    constructor({ health, attack, defense }, position, afterWin) {
        this.currentHealth = health;
        this.totalHealth = health;
        this.attack = attack;
        this.defense = defense;
        this.isAttacking = false;
        this.isBlocking = false;
        this.criticalHitAvailable = true;
        this.healthBar = document.getElementById(`${position}-fighter-indicator`);
        this.afterWin = afterWin;
    }

    doDamage(defender, isCriticalCombination) {
        if (!isCriticalCombination && !defender.isBlocking) {
            // eslint-disable-next-line no-use-before-define
            const damage = getDamage(this, defender);
            defender.updateHealth(damage, this);
        } else if (isCriticalCombination) {
            const criticalDamage = 2 * this.attack;
            defender.updateHealth(criticalDamage, this);
        }
    }

    updateHealth(damage, attacker) {
        if (damage === 0) {
            return;
        }
        this.currentHealth = this.currentHealth - damage > 0 ? this.currentHealth - damage : 0;
        if (this.currentHealth === 0) {
            attacker.afterWin();
        }
        this.healthBar.style.width = `${(this.currentHealth / this.totalHealth) * 100}%`;
    }
}

class FighterAction {
    constructor(onKeyDownAction, onKeyUpAction) {
        this.onKeyDownAction = onKeyDownAction;
        this.onKeyUpAction = onKeyUpAction;
    }

    runAction(keyEvent) {
        switch (keyEvent) {
            case 'keydown': {
                this.onKeyDownAction();
                break;
            }
            case 'keyup': {
                this.onKeyUpAction();
                break;
            }
            default:
                throw Error('Key action not implemented!');
        }
    }
}
export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        function afterWin(winner) {
            resolve(winner);
            // eslint-disable-next-line no-use-before-define
            cleanUp();
        }

        const firstFighterState = new FighterState(firstFighter, 'left', () => afterWin(firstFighter));
        const secondFighterState = new FighterState(secondFighter, 'right', () => afterWin(secondFighter));

        const comboActionKeys = new Map([
            ...controls.PlayerOneCriticalHitCombination.map(key => [key, false]),
            ...controls.PlayerTwoCriticalHitCombination.map(key => [key, false])
        ]);
        /* eslint no-param-reassign: "error" */
        function playerCriticalAttack(attacker, defender) {
            if (attacker.criticalHitAvailable && !attacker.isAttacking && !attacker.isBlocking) {
                attacker.criticalHitAvailable = false;
                attacker.doDamage(defender, true);
                setTimeout(() => {
                    attacker.criticalHitAvailable = true;
                }, 10_000);
            }
        }

        function playerSimpleAttack(attacker, defender) {
            if (!attacker.isAttacking && !attacker.isBlocking) {
                attacker.isAttacking = true;
                attacker.doDamage(defender, false);
            }
        }

        const singleActionKeyMap = new Map();

        singleActionKeyMap.set(
            controls.PlayerOneAttack,
            new FighterAction(
                () => playerSimpleAttack(firstFighterState, secondFighterState),
                () => {
                    firstFighterState.isAttacking = false;
                }
            )
        );
        singleActionKeyMap.set(
            controls.PlayerTwoAttack,
            new FighterAction(
                () => playerSimpleAttack(secondFighterState, firstFighterState),
                () => {
                    secondFighterState.isAttacking = false;
                }
            )
        );
        singleActionKeyMap.set(
            controls.PlayerOneBlock,
            new FighterAction(
                () => {
                    firstFighterState.isBlocking = true;
                },
                () => {
                    firstFighterState.isBlocking = false;
                }
            )
        );
        singleActionKeyMap.set(
            controls.PlayerTwoBlock,
            new FighterAction(
                () => {
                    secondFighterState.isBlocking = true;
                },
                () => {
                    secondFighterState.isBlocking = false;
                }
            )
        );

        function keyDownHandler({ code }) {
            if (singleActionKeyMap.has(code)) {
                singleActionKeyMap.get(code).runAction('keydown');
            } else if (comboActionKeys.has(code)) {
                comboActionKeys.set(code, true);
                const allKeysForFirstPlayerCriticalHit = controls.PlayerOneCriticalHitCombination.every(key =>
                    comboActionKeys.get(key)
                );
                const allKeysForSecondPlayerCriticalHit = controls.PlayerTwoCriticalHitCombination.every(key =>
                    comboActionKeys.get(key)
                );
                if (allKeysForFirstPlayerCriticalHit) {
                    playerCriticalAttack(firstFighterState, secondFighterState);
                }
                if (allKeysForSecondPlayerCriticalHit) {
                    playerCriticalAttack(secondFighterState, firstFighterState);
                }
            }
        }

        function keyUpHandler({ code }) {
            if (singleActionKeyMap.has(code)) {
                singleActionKeyMap.get(code).runAction('keyup');
            } else if (comboActionKeys.has(code)) {
                comboActionKeys.set(code, false);
            }
        }

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        function cleanUp() {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }
    });
}

export function getDamage(attacker, defender) {
    // return damage
    // eslint-disable-next-line no-use-before-define
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage < 0 ? 0 : damage;
}

export function getHitPower(fighter) {
    // return hit power
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}
