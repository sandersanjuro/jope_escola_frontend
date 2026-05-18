/**
 * Helpers para filtros múltiplos Status / Tipo de OS (formato "id - label").
 */

export const parseIdsFromSelectLabels = (values) => {
    if (!Array.isArray(values) || values.length === 0) {
        return [];
    }
    return values
        .map((element) => {
            const str = String(element);
            const sep = str.indexOf(' - ');
            const idPart = sep >= 0 ? str.slice(0, sep) : str;
            const id = parseInt(idPart.trim(), 10);
            return Number.isNaN(id) ? null : id;
        })
        .filter((id) => id !== null && id > 0);
};

/** Parâmetro CSV para idStatus/idTypeOs na API, ou '' ao limpar filtros. */
export const resolveMultiFilterParam = (forceEmpty, selectValues) => {
    if (forceEmpty === '') {
        return '';
    }
    const ids = parseIdsFromSelectLabels(selectValues);
    return ids.length > 0 ? ids.join(',') : '';
};
