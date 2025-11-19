const buildUpdateQuery = (reqBody, tableName, entryIds, fields) => {
    let query = `UPDATE ${tableName} SET `;
    let index = 1;
    const values = [];

    for (const field of fields) {
        if (reqBody[field] != null) {
            if (index > 1) {
                query += ', ';
            }

            query += `${field} = $${index++}`;
            values.push(reqBody[field]);
        }
    }

    let entryIdsParsed = {};

    if (typeof entryIds !== 'object') {
        entryIdsParsed = { id: entryIds };
    } else {
        entryIdsParsed = entryIds;
    }

    query += ' WHERE';

    Object.entries(entryIdsParsed).forEach(([idColName, id], i) => {
        if (i > 0) {
            query += ' AND';
        }

        query += ` ${idColName} = $${index++}`;
        values.push(id);
    });

    query += ` RETURNING *;`
    return { query, values };
};

export { buildUpdateQuery };