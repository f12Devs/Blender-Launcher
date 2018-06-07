/* global jest */
export default jest.fn().mockImplementation(function (configuration) {
    return new Promise(function (resolve, reject) {
        configuration.onProgress(50, 100)
        resolve()
    })
})
