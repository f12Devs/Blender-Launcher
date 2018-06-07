let extractFolder = 'Stable'
export function setExtractFolder (folder) {
    extractFolder = folder
}
export const mockOn = jest.fn().mockImplementation((event, action) => {
    if (event === 'progress') action(50, 100)
    if (event === 'extract') action([{ folder: extractFolder }])
})
export const mockExtract = jest.fn()
const mock = jest.fn().mockImplementation(() => {
    return {
        extract: mockExtract,
        on: mockOn
    }
})
mock.prototype.extract = mockExtract

export default mock
