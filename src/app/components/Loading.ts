import styled from "styled-components";

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 2rem;
`;

export const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 20px solid #333;
  border-top-color: #004d1a;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingComponents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const SpinnerComponents = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid rgba(51, 51, 51, 0.2);
  border-top-color: #004d1a;
  animation: spin 0.8s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
