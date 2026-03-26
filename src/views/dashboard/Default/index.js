import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import Text from './Text';
// import RecipeReviewCard from './RecipeReviewCard';
import { getPosts } from '../../../services/post';
import RecipeViewCard from 'components/Card/RecipeViewCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [post, setPost] = useState([]);
    useEffect(() => {
        setLoading(false);
    }, []);
    useEffect(() => {
        getAllPost();
    }, []);
    function getAllPost() {
        getPosts().then((resp) => {
            setPost(resp.data);
        });
    }
    function mapPosts() {
        return post.map((desc) => (
            <Grid style={{ marginTop: '30px' }} item xs={12}>
                <Grid container alignItems="center" justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12} md={8} sm={12}>
                        <RecipeViewCard
                            name={desc.user}
                            datePost={desc.datePost}
                            description={desc.description}
                            media={desc.photos}
                            videos={desc.videos}
                        />
                    </Grid>
                </Grid>
            </Grid>
        ));
    }

    return (
        <>
            <Text getAllPost={getAllPost} />
            {mapPosts()}
        </>
    );
};

export default Dashboard;
