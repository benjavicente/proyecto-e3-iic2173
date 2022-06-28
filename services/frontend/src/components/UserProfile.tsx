import React from 'react'
import styles from '../styles/Home.module.css'

const UserProfile = ({ data }) => {
  let noImage = false;
  
  if (!data.images) {
    noImage = true;
    data.images = [];
  }
  
  const userImages = data.images.map((image) => {
    return (
      <div class="flex flex-wrap w-1/4">
        <div className="w-full p-1 md:p-2">
          <img 
            key={image.id}
            alt="gallery" 
            class="block object-cover object-center w-full h-full rounded-lg border-2 border-slate-100 shadow-md"
            src={image.imageUrl}
          />
        </div>
      </div>
    )
  });
  
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="font-bold text-2xl">
          {data.firstname} {data.lastname}
        </h2>

        <p>
          ({data.email}  {data.phone ? `+56${data.phone}` : 'Teléfono no disponible'})
        </p>
      </div>

      <div className="overflow-hidden w-9/12 mx-auto text-gray-700 ">
        <div className="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
          <div className="flex justify-between flex-wrap -m-1 md:-m-2">
            { data.images.length != 0 ? userImages 
            : 
            null
            }             
          </div>
        </div>
      </div>
    </div> 
  )
}

export default UserProfile

