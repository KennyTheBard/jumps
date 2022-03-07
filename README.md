# jumps
Boiler plate generator using templates

## How to use

1. Write a template file by using the Jumps syntax
   ```
   const %%var1%% = %%var2%%;
   ```
2. Add the new template to the Jumps collection
   ```
   jumps template add example.txt --name example
   ```
3. Use it to generate code
   ```
   jumps template use example
   ```