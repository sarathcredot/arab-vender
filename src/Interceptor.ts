// Interceptors.ts
import { ApolloLink, Observable, Operation, NextLink, InMemoryCache } from '@apollo/client';
import { useNavigate } from 'react-router';

// Request Interceptor
export const requestInterceptor = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<any> => {
    // console.log(localStorage.getItem('token'));

    // Modify the operation before it is sent
    operation.setContext({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        // Authorization: localStorage.getItem('token'),
        // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJmYTcyNzk3MWQ4NzkyYWY4Y2Q2ZCIsImlhdCI6MTcwNTc3MTExMywiZXhwIjoxNzA1Nzc0NzEzfQ.v2q-QrqU5_UbRT_8M84Ufu5ppP7PxI5DGeMQmJO3Kj8"
        // `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Call the next link in the chain
    return forward(operation);
  }
);

// Response Interceptor
export const responseInterceptor = new ApolloLink(
  (operation: Operation, forward: NextLink): Observable<any> => {
    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          // console.log('GraphQL Result:', result?.errors);
          // Check if there are errors in the result
          if (result.errors && result.errors.some((error: any) => error.extensions?.code === "UNAUTHORIZED")) {
            console.log("Redirecting to login page");
            // localStorage.removeItem("token");
            // window.location.href = "/login"
          } else {
            observer.next(result);
          }

        },
        error: (error) => {
          // Handle errors globally
          console.error('GraphQL Error:', error);
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
);



const getAuthToken = () => {
  // console.log(localStorage.getItem("token"));

  return localStorage.getItem("token") || null;
};

export const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken();
  // console.log(token);

  operation.setContext(({ headers }: any) => ({
    headers: {
      ...headers,
      // Authorization: token ? token : "",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});