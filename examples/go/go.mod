module github.com/Sagar9980/local-letter/examples/go

go 1.23

require (
	github.com/Sagar9980/local-letter/packages/go-sdk v0.0.0
	github.com/joho/godotenv v1.5.1
)

require github.com/resend/resend-go/v2 v2.28.0 // indirect

// Runs against the SDK's actual source rather than a published tag — if the
// package layout or an exported name is wrong, this example is where you find
// out. Drop this line to build against a real release.
replace github.com/Sagar9980/local-letter/packages/go-sdk => ../../packages/go-sdk
