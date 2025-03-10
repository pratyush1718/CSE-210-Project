import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ExtendedTrackObjSpec, SoundTrack } from '../types';
import { fetchAudio, getImageURL } from '../controller/contentDispatcher';
import { Avatar } from '@mui/material';
import { Download, MusicNote } from '@mui/icons-material';
import LikeButton from './LikeButton';
import { usePlayer } from '../stateManagement/PlayerContext';
import { audioDownloadDispatcher } from '../controller/downloadDispatcher';

interface RecCardProps {
  musicInfo: ExtendedTrackObjSpec;
  uid: string;
}

export default function RecCard({ musicInfo, uid }: RecCardProps) {
  const { _id, imageFileId, title, likes, allowDownloads, description } = musicInfo;

  const { setCurrentTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const handlePlay = (track: SoundTrack) => {
    const playerTrack = fetchAudio(track);
    if (playerTrack) {
      playerTrack.then((track) => {
        setCurrentTrack(track);
        if (!isPlaying) {
          togglePlay();
        }
      });
    } else {
      alert(`Failed to play track`);
    }
  };

  const handleDownload = () => {
    audioDownloadDispatcher(musicInfo as SoundTrack);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto', width: 300 }}>
            <Typography component="div" variant="h6">
              {title}
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </CardContent>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 1, pb: 1, width: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color={isPlaying && currentTrack?._id === _id ? 'primary' : 'default'}
                onClick={() => handlePlay(musicInfo as SoundTrack)}
                sx={{ ml: 1 }}
              >
                <PlayArrowIcon />
              </IconButton>
              <LikeButton trackId={_id} initialLikeCount={likes} firebaseId={uid} />
            </Box>
            <Box>
              {allowDownloads && (
                <IconButton onClick={handleDownload} sx={{ mr: 2 }}>
                  <Download />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        {imageFileId ? (
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={getImageURL(imageFileId)}
            alt="Live from space album cover"
          />
        ) : (
          <Avatar alt="Music Icon" variant="rounded" sx={{ width: 151, height: 151, bgcolor: 'primary.light' }}>
            <MusicNote sx={{ fontSize: 30 }} />
          </Avatar>
        )}
      </Card>
    </Box>
  );
}
