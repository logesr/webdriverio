import RunnerStream from '../src/stdStream'

describe('RunnerStream', () => {
    let stream
    let pushSpy
    const cb = jest.fn()
    beforeEach(() => {
        stream = new RunnerStream()
        pushSpy = jest.spyOn(stream, 'push')
    })

    test('should have pipe listener', () => {
        stream._transform('foobar', null, cb)
        expect(cb).toBeCalledWith(null, 'foobar')
    })

    test('should remove certain last listener on pipe', () => {
        const stream2 = new RunnerStream()
        stream.on('foobar', () => {})
        stream.on('error', () => {})
        stream2.pipe(stream)

        expect(stream.listeners('foobar')).toHaveLength(1)
        expect(stream.listeners('error')).toHaveLength(1)
        expect(stream.listeners('close')).toHaveLength(0)
        expect(stream.listeners('drain')).toHaveLength(0)
        expect(stream.listeners('finish')).toHaveLength(0)
        expect(stream.listeners('unpipe')).toHaveLength(0)
    })

    afterEach((done) => {
        cb.mockClear()
        pushSpy.mockClear()
        stream.end(() => done())
    })
})
