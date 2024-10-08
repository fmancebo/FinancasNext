// styles.ts
import styled from "styled-components";

export const ChartContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0;

  @media screen and (max-width: 600px) {
    height: calc(100vh - 50px);
  }
`;

export const ChartWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 650px;
  margin: 0 10px;

  h3 {
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 1.5rem;
  }
`;
