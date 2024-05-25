// mock contacts for web testing
const mockContacts = [
    { id: '1', givenName: 'John', familyName: 'Doe', phoneNumbers: [{ label: 'mobile', number: '123-456-7890' }] },
    { id: '2', givenName: 'Jane', familyName: 'Smith', phoneNumbers: [{ label: 'home', number: '098-765-4321' }] },
    // Add more mock contacts as needed
  ];
  
  export const getContacts = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockContacts);
      }, 1000); // Simulate network delay
    });
  };
  