const query = require('../services/database');
const { dbConfig } = require('../config');
const { pageSize } = require('../config');

/**
 * Retrives all the persons list from the database if page number not provided
 * Retrives only the respective persons of a page provided in the request query param
 *
 * @param   {HttpRequest}  req  page number as query param page.
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return  returns metaData with page details and persons list as records
 */
const getAllPersons = async (req, res) => {

    if (req.query.page) {
        const pageNo = parseInt(req.query.page);
        const offSet = (pageNo * pageSize) - pageSize;
        try {
            const [records, count] = await query(`CALL ${dbConfig.database}.get_page(?, ?)`, [offSet, pageSize]);

            return res.status(200).json({
                metaData: {
                    totalRecords: count[0]["COUNT(*)"],
                    totalPages: Math.ceil(count[0]["COUNT(*)"] / pageSize),
                    currentPage: pageNo
                },
                records: records
            });
        } catch {
            return res.status(500);
        }
    }

    try {
        const [records, count] = await query(`CALL ${dbConfig.database}.get_persons()`);
        return res.status(200).json({ records: records, count: count[0]['COUNT(*)'] });
    } catch {
        return res.status(500);
    }
}


/**
 * Sort the data with respect to fields
 *
 * @param   {HttpRequest}  req  field, page, desc paramters corresponds to field to be sorted, page and descending order
 * @param   {[type]}  res  HTTP Response object
 *
 * @return  returns metaData with page details and persons list as records in sorted order
 */
const sortPages = async (req, res) => {

    const field = req.params.field;
    const pageNo = parseInt(req.params.page);
    const desc = req.params.desc; // If descending order is true
    const offSet = (pageNo * pageSize) - pageSize;

    if (desc) {
        try {
            const [records, count] = await query(`CALL ${dbConfig.database}.get_sorted_desc(?, ?, ?)`, [field, offSet, pageSize]);
            return res.status(200).json({
                metaData: {
                    totalRecords: count[0]["COUNT(*)"],
                    totalPages: Math.ceil(count[0]["COUNT(*)"] / pageSize),
                    currentPage: pageNo
                },
                records: records
            });
        } catch {
            return res.status(500);
        }
    }

    try {
        const [records, count] = await query(`CALL ${dbConfig.database}.get_sorted(?, ?, ?)`, [field, offSet, pageSize]);
        return res.status(200).json({
            metaData: {
                totalRecords: count[0]["COUNT(*)"],
                totalPages: Math.ceil(count[0]["COUNT(*)"] / pageSize),
                currentPage: pageNo
            },
            records: records
        });
    } catch {
        return res.status(500);
    }
}

/**
 * Inserts the new person data to the database
 *
 * @param   {HttpRequest}  req  Respective field names as request body
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return   Sends success status as response message
 */
const addPerson = async (req, res) => {

    const fName = req.body.FirstName;
    const lName = req.body.LastName;
    const addrLine1 = req.body.AddressLine1;
    const addrLine2 = req.body.AddressLine2;
    const city = req.body.City;
    const state = req.body.State;
    const pincode = parseInt(req.body.Pincode);
    const phone = parseInt(req.body.PhoneNumber);

    const values = [0, fName, lName, addrLine1, addrLine2, city, state, pincode, phone]

    try {
        await query(`CALL ${dbConfig.database}.add_person(?,?,?,?,?,?,?,?,?)`, values);
        return res.status(201).json({ message: "Person added" });
    }
    catch (error) {
        if (error.errno === 1062) {
            return res.status(409).json({
                message: "Add a different phone number"
            });
        }
        return res.status(500);
    }
}


/**
 * Exact pattern search
 *
 * @param   {HttpRequest}  req  searchVal as query paramter
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return   returns metaData with page details and matched persons list
 */
const searchPerson = async (req, res) => {

    const paramVal = req.query.searchVal;
    const pageNo = parseInt(req.query.pageNo);
    const offSet = (pageNo * pageSize) - pageSize;

    try {
        const records = await query(`CALL ${dbConfig.database}.exact_search(?, ?, ?)`, [paramVal, offSet, pageSize]);
        return res.status(200).json({
            metaData: {
                totalRecords: records[0].length,
                totalPages: Math.ceil(records[0].length / pageSize),
                currentPage: pageNo
            },
            records: records[0]
        });
    } catch {
        return res.status(500);
    }
}


/**
 * Wild Card search
 *
 * @param   {HttpRequest}  req  searchVal as query paramter
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return   returns metaData with page details and matched persons list
 */
const wildCardSearch = async (req, res) => {

    const paramVal = req.query.searchVal;
    const pageNo = parseInt(req.query.pageNo);
    const offSet = (pageNo * pageSize) - pageSize;

    try {
        const records = await query(`CALL ${dbConfig.database}.wild_card(?,?,?)`, [paramVal, offSet, pageSize]);
        return res.status(200).json({
            metaData: {
                totalRecords: records[0].length,
                totalPages: Math.ceil(records[0].length / pageSize),
                currentPage: pageNo
            },
            records: records[0]
        });
    } catch {
        return res.status(500);
    }
}


/**
 * Updates the person
 *
 * @param   {HttpRequest}  req  Values to be updated in the request body with PersonID as the key
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return   Returns status code
 */
const updatePerson = async (req, res) => {

    const newValues = [];

    var query = `UPDATE ${dbConfig.database}.Persons SET`;

    Object.entries(req.body).forEach(([key, value]) => {
        if (key != 'PersonID') {
            query += ` ${key}=?,`;
            newValues.push(value);
        }
    });

    query = query.slice(0, -1); // Remove last ","
    query += ' WHERE PersonID=?;';
    newValues.push(req.body.PersonID);

    try {
        await query(query, newValues);
        return res.sendStatus(204);
    } catch {
        return res.status(500);
    }
}


/**
 * Deletes a person from the database
 *
 * @param   {HttpRequest}  req  phone as the request param
 * @param   {HttpResponse}  res  HTTP Response object
 *
 * @return   Returns status code
 */
const deletePerson = async (req, res) => {
    
    const phone = parseInt(req.params.phone);

    try {
        await query(`CALL ${dbConfig.database}.delete_person(?)`, [phone]);
        return res.sendStatus(204);
    } catch {
        return res.status(500);
    }
}


module.exports = {
    getAllPersons,
    addPerson,
    searchPerson,
    wildCardSearch,
    updatePerson,
    deletePerson,
    sortPages
}