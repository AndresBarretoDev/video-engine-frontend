# Delta for local-render

> New capability (Capa 2): real local rendering behind provider ports. Replaces the mock processor.

## ADDED Requirements

### Requirement: Provider-port abstraction

The render and storage layers MUST sit behind `RenderProvider` and `StorageProvider` ports so switching to cloud (Lambda + S3) requires NO changes to the processor, service, or controllers. Active provider MUST be gated by `RENDER_PROVIDER` (`mock | local`).

#### Scenario: Cloud swap touches no pipeline code
- GIVEN render runs locally via `RENDER_PROVIDER=local`
- WHEN the provider is swapped to a cloud adapter
- THEN no changes to `render-jobs.processor.ts`, the service, or controllers MUST be required.

#### Scenario: Mock remains revertible
- GIVEN instability in the local renderer
- WHEN `RENDER_PROVIDER=mock` is set
- THEN the system MUST fall back to the prior mock behavior without code changes.

### Requirement: Real local MP4 output

The local adapter MUST produce real MP4 (H.264) files via the Remotion CLI — NOT simulated/pre-recorded output.

#### Scenario: Local render yields a real file
- GIVEN a valid composition and props
- WHEN a render job runs under `RENDER_PROVIDER=local`
- THEN a real MP4 (H.264) MUST be written to storage and resolvable for download.

### Requirement: Server-side job durability

Rendering MUST run server-side and MUST continue if the browser tab closes; progress MUST be observable on return.

#### Scenario: Render survives tab close
- GIVEN a submitted render job
- WHEN the Producer closes the tab and returns
- THEN the job status MUST reflect actual progress (not reset to pending).

### Requirement: Honest latency expectation

The system MUST communicate realistic local render latency (30–90s per video) and MUST NOT imply sub-5-second renders.

#### Scenario: UI sets expectation
- GIVEN a render is enqueued locally
- WHEN progress is shown
- THEN the UI MUST present a realistic time expectation, not an instant-result promise.
