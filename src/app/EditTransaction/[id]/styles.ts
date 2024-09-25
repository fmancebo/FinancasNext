import styled from "styled-components";

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Field = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #004d1a;
  color: white;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    background-color: #004d1a;
    color: white;
    font-size: 13px;
  }

  &:focus-visible {
    outline: none;
  }

  &:hover {
    background-color: #00532d;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const RadioButton = styled.div`
  display: flex;
  align-items: center;
`;

export const Button = styled.button`
  width: 100%;
  background-color: #00532d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #004d1a;
  }
`;
