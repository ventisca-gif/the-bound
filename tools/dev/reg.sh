cd /home/claude/thebound
for t in smoke flow guide skills2 skills3 jobs2 romance boss3 family world2 slots portrait apk perf; do
  echo "== $t"; timeout 400 python3 tests/play.py "file://$PWD/dist/test.html${2:-}" $1/r_$t.png 900 500 @tests/$t.txt 2>&1 | grep -v TUNNEL | grep "PAGEERROR\|Error\|error:\|JS>" | grep -v "^JS> 1$" | cut -c1-300 | head -8
done
