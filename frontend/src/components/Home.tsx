import { Link, useParams } from "react-router-dom"
import { RiUserSharedLine } from "react-icons/ri"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/store"
import axios from "axios"
import { reviewActions } from "../features/review"
import { Review } from "../models"
import { Empty } from "antd"

const Home = () => {
  const params = useParams();
  const allreviews = useSelector((state: RootState) => state.review.reviews);
  const dispatch = useDispatch();
  var [reviews, setReviews] = useState<Array<Review>>([]);
  const fetchReviews = async () => {
    const res = await axios.get("/api/restaurant/get");
    if (res && res.data) {
      dispatch(reviewActions.getReviews(res.data.restaurants));
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (params.id) {
      const userReviews = allreviews.filter(review => review.user_id === Number(params.id));
      setReviews(userReviews);
    } else {
      setReviews(allreviews);
    }
  }, [allreviews, params.id]);

  return (
    <div className="flex justify-center mt-5 lg:m-10">
      {
        reviews.length > 0 ?
          <div className="xl:w-[1200px] xl:grid-cols-4 lg:grid-cols-3 grid grid-cols-2 p-2 gap-2">
            {
              reviews.map((review, index) => (
                <Link key={index} to={`/review/${review.id}`} className="border border-[#d7d7d7] rounded-md cursor-pointer overflow-hidden">
                  <div className="relative pt-[56.25%]">
                    <img className="absolute left-0 top-0 right-0 bottom-0 object-cover w-full h-full" src={`/images/${review.avatar}`} alt="" />
                  </div>
                  <div>
                    <div className="py-2 px-2 border-b border-[#d7d7d7]">
                      <h2 className="truncate text-base font-bold">{review.name}</h2>
                      <p className="truncate text-black">{review.address}</p>
                    </div>
                    <div className="flex items-center px-2 pt-2 pb-5">
                      <RiUserSharedLine className="text-black" />
                      <span className="px-2 text-black">{review.user}</span>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
          :
          <div className="xl:w-[1200px] pt-40">
            <Empty description="Chưa có bài review nào!" />
          </div>
      }

    </div>

  )
}

export default Home