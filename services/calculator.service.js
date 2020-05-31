module.exports = class CalculatorService {

    calculateStatus(base, iv, level) {
        return Math.round(base + (1 + ((iv / 2)) * (level / 2)));
    }

    calculateDamage(agressiveAtk, defensiveDef, baseSkillValue) {
        return Math.round((Math.max((agressiveAtk - defensiveDef), 0) + (baseSkillValue / 2)))
    }

    calculateHpLost(hp, damage) {
        return Math.round(Math.max((hp - damage), 0));
    }

}