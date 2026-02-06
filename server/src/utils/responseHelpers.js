function success(res, data, statusCode = 200) {
    res.status(statusCode).json({
        success: true,
        data
    })
}

function created(res, data) {
    res.status(201).json({
        success: true,
        data
    })
}

function successMessage(res, message, statusCode = 200) {
    res.status(statusCode).json({
        success: true,
        message
    })
}

function successPaginated(res, data, pagination) {
    res.json({
        success: true,
        data,
        pagination
    })
}

module.exports = { success, created, successMessage, successPaginated }
