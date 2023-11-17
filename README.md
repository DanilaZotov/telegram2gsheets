# telegram2gsheets
Apps script app to handle messages in telegram group chats and fill data to google sheets.

This code checks, if any user sent a message that matches format like this:

```
#купил usdt 


 +     100 000 
 *        3,66 
 ------------- 
 +     366 000
```

Then it fills google sheet with date of message, name of group chat where it came from and those three numbers
