import Foundation
import CoreGraphics
import AppKit

// Fast, non-intrusive global click monitor for macOS desktop overlay
// Uses CGEventSource buttonState - requires zero permissions, does not block mouse events
var wasDown = false

// Unbuffer stdout
setbuf(stdout, nil)

let displayHeight = Double(CGDisplayPixelsHigh(CGMainDisplayID()))

while true {
    let isDown = CGEventSource.buttonState(.combinedSessionState, button: .left)
    if isDown && !wasDown {
        if let event = CGEvent(source: nil) {
            let loc = event.location
            // Output X,Y coordinates
            print("\(Int(loc.x)),\(Int(loc.y))")
            fflush(stdout)
        }
    }
    wasDown = isDown
    usleep(20000) // 20ms poll (0.01% CPU)
}
