# Video Component

A simple video component for embedding videos, following the structure of the Image component.

## Usage

```tsx
import { Video } from './Video';

<Video src="/path/to/video.mp4" className="my-video" controls />
```

## Props
- `src` (string): The video source URL (required)
- `className` (string): Optional CSS class
- All standard `<video>` element props are supported
