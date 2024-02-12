const asyncHandler = (requestHandler) => {
    return Promise.resolve(requestHandler(req,res,next)).reject((err) => next(err))
}

export {asyncHandler}


//try catch approach for it
// const asyncHandler = (funct) => async (req,res,next) => {
//     try {
//         await funct(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }