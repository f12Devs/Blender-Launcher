/* global jest */
export default jest.fn().mockImplementation((configuration) => {
    return new Promise((resolve, reject) => {
        configuration.onProgress(50, 100)
        resolve()
    })
})
