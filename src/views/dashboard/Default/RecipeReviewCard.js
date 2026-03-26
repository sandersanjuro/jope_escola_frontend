import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactPhoto from './curso_react.jpg';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Grid } from '@mui/material';
import { gridSpacing } from 'store/constant';
import ReactPlayer from 'react-player';

export default function RecipeReviewCard(props) {
    const YoutubeSlide = ({ url, isSelected }) => <ReactPlayer width="100%" url={url} playing={false} controls={true} />;
    const customRenderItem = (item, props) => <item.type {...item.props} {...props} />;
    const getVideoThumb = (videoId) => `https://img.youtube.com/vi/${videoId}/default.jpg`;
    const getVideoId = (url) => url.substr('https://www.youtube.com/embed/'.length, url.length);
    const customRenderThumb = (children) =>
        children.map((item) => {
            const videoId = getVideoId(item.props.url);
            return <img src={getVideoThumb(videoId)} alt={item.props.created_at} />;
        });
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {props.name[0]}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={props.name}
                subheader={props.datePost}
            />
            <CardContent>
                <Typography style={{ fontSize: '20px', color: 'black' }} variant="body2" color="text.primary">
                    {props.description}
                </Typography>
            </CardContent>
            {props.media && props.media.length > 0 && (
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12} md={12}>
                            <Carousel height="100%">
                                {props.media.map((desc) => (
                                    <img key={desc.id} src={desc.url} alt={desc.created_at} height="100%" />
                                ))}
                            </Carousel>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {props.videos && props.videos.length > 0 && (
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12} md={12}>
                            <Carousel renderItem={customRenderItem} renderThumbs={customRenderThumb} height="100%">
                                {props.videos.map((desc) => (
                                    <YoutubeSlide key={desc.id} url={desc.url} isSelected="false" />
                                ))}
                            </Carousel>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {/* <Carousel>
                <CardMedia
                    component="img"
                    image="https://drive.google.com/uc?id=131SEeQa6NgJJ6EGpCqVo_Ou-2ede9FyA"
                    alt="Paella dish sad as"
                />
                <CardMedia component="img" image={ReactPhoto} alt="Paella dish asd asd " />
                <CardMedia component="img" image={ReactPhoto} alt="Paella dish dsadsda a" />
            </Carousel> */}
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}
