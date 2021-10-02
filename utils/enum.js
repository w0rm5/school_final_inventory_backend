export const meta = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401, //User not authenticated
    FORBIDDEN: 403, //Permission denied, user is known but is not permitted to carry out requested action
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
}

export const sexes = {
    MALE: 1,
    FEMALE: 2
}

export const stockInTypes = {
    PURCHASE: 1,
    RETURN: 2,
    ADMIN_INCREASE: 3
}

export const stockOutTypes = {
    SALE: 1,
    SCRAP: 2,
    ADMIN_DECREASE: 3
}