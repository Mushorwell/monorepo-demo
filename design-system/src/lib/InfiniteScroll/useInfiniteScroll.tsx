// src/components/InfiniteScrollList.tsx
// import React, { useEffect, useRef } from 'react';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { renderArrayItems } from '@monorepo-demo/utilities'; // Import the utility function

// const fetchPosts = async ({ pageParam = 1 }) => {
//   const response = await axios.get(
//     `https://api.example.com/posts?page=${pageParam}`
//   );
//   return response.data;
// };

// const InfiniteScrollList = () => {
//   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
//     useInfiniteQuery('posts', fetchPosts, {
//       getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
//     });

//   const observer = useRef<IntersectionObserver | undefined>();

//   const lastPostElementRef = (node) => {
//     if (isFetchingNextPage) return;
//     if (observer.current) observer.current.disconnect();

//     observer.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasNextPage) {
//         fetchNextPage();
//       }
//     });

//     if (node) observer.current.observe(node);
//   };

//   // Use the renderArrayItems utility to render the list
//   const renderPosts = renderArrayItems(({ title }) => <li>{title}</li>);

//   return (
//     <div>
//       <h1>Infinite Scroll List</h1>
//       <ul>
//         {data?.pages.map((page) =>
//           renderPosts(page.items, {
//             listId: 'posts',
//             // You can add more options here if needed
//           })
//         )}
//         {isFetchingNextPage && <li>Loading more...</li>}
//       </ul>
//       {isFetching && <p>Loading...</p>}
//     </div>
//   );
// };

// export default InfiniteScrollList;
