import { Video } from '@tarojs/components';
import type { VideoProps } from '@tarojs/components';

export function MyVideo(props: VideoProps) {
  return (
    <Video
      id='myVideo'
      src={props.src}
      controls
      showFullscreenBtn
      showCenterPlayBtn
      autoPauseIfNavigate
      autoPauseIfOpenNative
      showPlayBtn
      objectFit='contain'
      poster={props.poster}
    ></Video>
  );
}
